import {createRouter, createWebHistory, RouteRecordRaw} from "vue-router";
import { CurrenciesBlock } from "@/pages";


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'main-page',
        components: {
            default: CurrenciesBlock,
        },
    },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
