import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilterTemplatesDto } from './dto/filter-templates.dto';
import { TemplatesService } from './templates.service';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  findAll(@Query() filter: FilterTemplatesDto) {
    return this.templatesService.findAll(filter);
  }

  @Get('categories')
  categories() {
    return this.templatesService.getCategories();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.templatesService.findOne(id);
  }
}
