import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchEntity } from './search.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UpdateSearchDto } from './dto/update-search.dto';
import { CreateSearchDto } from './dto/create-search.dto';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(SearchEntity)
    private readonly searchRepository: Repository<SearchEntity>,
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly emailService: EmailService,
  ) {}

  async findAll() {
    return this.searchRepository.find({
      select: ['id', 'query', 'minPrice', 'maxPrice', 'isActive'],
    });
  }

  async findOneByOrFail(
    where: FindOptionsWhere<SearchEntity> | FindOptionsWhere<SearchEntity>[],
  ) {
    try {
      return this.searchRepository.findOneByOrFail(where);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findAllByUserId(userId: number) {
    return this.searchRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async store(data: CreateSearchDto) {
    const user = await this.userService.findOneByOrFail({ id: data.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

     const search = this.searchRepository.create({
      ...data,
      user,
    });

    return this.searchRepository.save(search);
  }

  async update(id: number, data: UpdateSearchDto) {
    const search = await this.findOneByOrFail({ id });
    this.searchRepository.merge(search, data);
    return this.searchRepository.save(search);
  }

  async destroy(id: number) {
    await this.searchRepository.findOneByOrFail({ id });
    this.searchRepository.softDelete({ id });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async executeSearches(): Promise<void> {
    const activeSearches = await this.searchRepository.find({
      where: { isActive: true },
      relations: ['user'],
    });

    await Promise.all(
      activeSearches.map(async (search) => {
        const { id, query, minPrice, maxPrice, user } = search;
        const results = await this.callMercadoLivreApi(query, minPrice, maxPrice);

        const emailBody = this.formatResults(results);
        
        await this.emailService.sendEmail(
          user.email,
          `Resultados da pesquisa "${query}", ID ${id}`,
          emailBody,
        );
      }),
    );
  }

  private async callMercadoLivreApi(query: string, minPrice?: number, maxPrice?: number): Promise<any> {
    const priceFilter = this.buildPriceFilter(minPrice, maxPrice);
    
    const url = `${process.env.MERCADO_LIVRE_API_BASE_URL}&q=${encodeURIComponent(query)}${priceFilter}`;

    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data.results;
    } catch (error) {
      console.error('Erro ao chamar a API do Mercado Livre:', error.message);
    }
  }

  private buildPriceFilter(minPrice?: number, maxPrice?: number): string {
    if (!minPrice && !maxPrice) return '';
    if (minPrice && !maxPrice) return `&price=${minPrice}-*`;
    if (!minPrice && maxPrice) return `&price=*-${maxPrice}`;
    return `&price=${minPrice}-${maxPrice}`;
  }

  private formatResults(results: any[]): string {
    return results
      .map(
        (result) => `
        <div>
          <h3>${result.title}</h3>
          <p>Preço: R$${result.price}</p>
          <p><a href="${result.permalink}" target="_blank">Ver produto</a></p>
        </div>
      `,
      )
      .join('<hr>');
  }
}
