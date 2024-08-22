import {ref} from "vue";
import {CurrenciesEnum, CurrencyModel,} from '@/pages'
import {currencies} from "@/shared";


export class AdapterService {
    /** Сервис */
    private static instance: AdapterService

    public static getInstance() {
        if (!AdapterService.instance) {
            AdapterService.instance = new AdapterService()
        }
        return AdapterService.instance
    }

    /** Выбранная валюта */
    SelectedCurrency = ref<CurrencyModel>(new CurrencyModel ({ Id: 1 ,Name: CurrenciesEnum.BYN }))
    /** Выбранная валюта */
    UserLocationCurrency = ref<CurrencyModel>(new CurrencyModel ({ Id: 1 ,Name: CurrenciesEnum.BYN }))
    /** Выбранная валюта */
    CurrenciesExchangeRates = ref<Array<{Name: string, Rate: number}>>([])
    /** Загрузка*/
    IsLoading = ref(true)


    /**
     * * Получить локацию пользователя
     */
    async getLocationCurrency () {
        this.IsLoading.value = true
        return  new Promise<string | undefined>(async (resolve) => {
            await fetch('https://ipapi.co/json')
                .then(res =>  res.json())
                .then(async (res) => {
                    const currentCountryCurrency = res.currency
                    const locationCurrency =  currencies.find(currency => currency.Name == currentCountryCurrency)  ??
                        new CurrencyModel({
                            Id: currencies.length + 1,
                            Name: currentCountryCurrency
                        })

                    this.SelectedCurrency.value = locationCurrency
                    this.UserLocationCurrency.value = locationCurrency
                    resolve(locationCurrency)
                })
                .catch(e => console.log('getLocationCurrency', e))
                .finally(() => {
                    this.IsLoading.value = false
                })
        })
    }

    /**
     * * Получить курс обмена валют
     */
    async getCurrenciesExchangeRates () {
        return
        this.IsLoading.value = true

        return  new Promise<string | undefined>(async (resolve) => {
        const currenciesNames = currencies.map(currency => currency.Name).join(',')

            const params = new URLSearchParams({
                access_key: 'f65dff8748927747af38fc39a6e2b01a',
                currencies: currenciesNames,
                source: this.SelectedCurrency.value.Name,
                format: 1
            }).toString();

            await fetch(`http://apilayer.net/api/live?${params}`)
                .then(res =>  res.json())
                .then(async (res) => {
                    const rates = this.mapToCurrenciesExchangeRates(res.quotes)
                        this.CurrenciesExchangeRates.value = rates

                    resolve(rates)
                })
                .catch(e => console.log('getCurrenciesExchangeRates', e))
                .finally(()=> {
                    this.IsLoading.value = false
                })
        })
    }

    /**
     * Приведение обменных ставок к единому виду
     */
    mapToCurrenciesExchangeRates(quotes: Record<string, number>):Array<{Name: string, Rate: number}> {
        const quotesValues = Object.keys(quotes)
        return quotesValues.map((quote) => {
            const currencyName = quote.slice(3);
            const currencyRate = quotes[quote];

            return {
                Name: currencyName,
                Rate: currencyRate
            };
        });
    }

}
