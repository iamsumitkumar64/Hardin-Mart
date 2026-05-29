import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { CreateUserAddressModule } from "./create-user-address/create-user-address.module";
import { DeleteUserAddressModule } from "./delete-user-address/delete-user-address.module";
import { GetUserAddressModule } from "./get-user-address/get-user-address.module";

@Module({
    imports: [
        CreateUserAddressModule,
        DeleteUserAddressModule,
        GetUserAddressModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: CreateUserAddressModule },
                    { path: '/', module: DeleteUserAddressModule },
                    { path: '/', module: GetUserAddressModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [],
    exports: [],
})

export class UserAddressModule { }