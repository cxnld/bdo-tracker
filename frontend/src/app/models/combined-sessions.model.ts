export interface CombinedSessions {
  time: {
    hours: number,
    minutes: number
  },
  items: [
    {
      itemID: string,
      name: string,
      price: number,
      totalQuantity: number,
      averageQuantity: number,
      moneyPerHour: number
    }?
  ]

}
