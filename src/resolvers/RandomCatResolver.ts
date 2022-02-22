import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Ctx, Allow, ProductService, RequestContext, Transaction } from '@vendure/core';
import { Permission } from '@vendure/common/lib/generated-types';
import {CatFetcher} from "../services/CatFetcher";

@Resolver()
export class RandomCatResolver {

    constructor(private productService: ProductService, private catFetcher: CatFetcher) {}

    @Transaction() // on fail all changes will be rolled back
    @Mutation() // graphql mutation with the corresponding name
    @Allow(Permission.UpdateCatalog)
    async addRandomCat(@Ctx() ctx: RequestContext, @Args() args: {id: number}) {
        const catImageUrl = await this.catFetcher.fetchCat();
        return this.productService.update(ctx, {
            id: args.id,
            customFields: { catImageUrl },
        });
    }
}
