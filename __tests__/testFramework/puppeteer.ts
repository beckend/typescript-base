import * as qs from 'querystring'

export class Puppeteer {
  public baseImageURL: string

  public constructor({
    // defaults to storybook example
    baseImageURL = 'http://localhost:9009/iframe.html',
  }: { readonly baseImageURL?: string } = {}) {
    this.baseImageURL = baseImageURL
  }

  public getImageURL = ({
    baseImageURL,
    query,
  }: {
    readonly baseImageURL?: string
    readonly query: qs.ParsedUrlQueryInput
  }) => `${baseImageURL || this.baseImageURL}?${qs.stringify(query)}`
}
