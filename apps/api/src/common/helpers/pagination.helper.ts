import { PaginationDto, PaginatedResult } from '../dto/pagination.dto';

export async function paginate<T>(
  model: any,
  args: { where?: any; orderBy?: any; include?: any; select?: any },
  query: PaginationDto,
): Promise<PaginatedResult<T>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.findMany({ ...args, skip, take: limit }),
    model.count({ where: args.where }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}
