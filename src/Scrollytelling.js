import React, { Component } from 'react'
import Paragraph from 'libe-components/lib/text-levels/Paragraph'
import Loader from 'libe-components/lib/blocks/Loader'
import LoadingError from 'libe-components/lib/blocks/LoadingError'
import ShareArticle from 'libe-components/lib/blocks/ShareArticle'
import LibeLaboLogo from 'libe-components/lib/blocks/LibeLaboLogo'
import ArticleMeta from 'libe-components/lib/blocks/ArticleMeta'
import { LoremIpsum } from 'lorem-ipsum'

export default class Scrollytelling extends Component {
  /* * * * * * * * * * * * * * * * *
   *
   * CONSTRUCTOR
   *
   * * * * * * * * * * * * * * * * */
  constructor () {
    super()
    this.c = 'lblb-scroll-y-telling'
    this.state = {
      loading_sheet: false,
      error_sheet: null,
      data_sheet: []
    }
    this.fetchSheet = this.fetchSheet.bind(this)
    this.fetchCredentials = this.fetchCredentials.bind(this)
    this.lorem = new LoremIpsum({
      sentencesPerParagraph: { min: 4, max: 11 },
      wordsPerSentence: { min: 4, max: 21 },
    })
  }

  /* * * * * * * * * * * * * * * * *
   *
   * DID MOUNT
   *
   * * * * * * * * * * * * * * * * */
  componentDidMount () {
    this.fetchCredentials()
    if (this.props.spreadsheet) this.fetchSheet()
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH CREDENTIALS
   *
   * * * * * * * * * * * * * * * * */
  async fetchCredentials () {
    const { api_url } = this.props
    const { format, article } = this.props.tracking
    const api = `${api_url}/${format}/${article}/load`
    try {
      const reach = await window.fetch(api, { method: 'POST' })
      const response = await reach.json()
      const { lblb_tracking, lblb_posting } = response._credentials
      window.lblb_tracking = lblb_tracking
      window.lblb_posting = lblb_posting
      return { lblb_tracking, lblb_posting }
    } catch (error) {
      console.error(`Unable to fetch credentials:`)
      console.error(error)
      return Error(error)
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * FETCH SHEET
   *
   * * * * * * * * * * * * * * * * */
  async fetchSheet () {
    this.setState({ loading_sheet: true, error_sheet: null })
    const sheet = this.props.spreadsheet
    try {
      const reach = await window.fetch(this.props.spreadsheet)
      if (!reach.ok) throw reach
      const data = await reach.text()
      const parsedData = data // Parse sheet here
      this.setState({ loading_sheet: false, error_sheet: null, data_sheet: parsedData })
      return data
    } catch (error) {
      if (error.status) {
        const text = `${error.status} error while fetching : ${sheet}`
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(text, error)
        return Error(text)
      } else {
        this.setState({ loading_sheet: false, error_sheet: error })
        console.error(error)
        return Error(error)
      }
    }
  }

  /* * * * * * * * * * * * * * * * *
   *
   * RENDER
   *
   * * * * * * * * * * * * * * * * */
  render () {
    const { c, state } = this

    /* Assign classes */
    const classes = [c]
    if (state.loading_sheet) classes.push(`${c}_loading`)
    if (state.error_sheet) classes.push(`${c}_error`)

    /* Load & errors */
    if (state.loading_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-loader'><Loader /></div></div>
    if (state.error_sheet) return <div className={classes.join(' ')}><div className='lblb-default-apps-error'><LoadingError /></div></div>

    /* Display component */
    return <div className={classes.join(' ')}>
      <div className={`${c}__header`}>
        HEADER
      </div>

      <div className={`${c}__content`}>{
        this.lorem.generateParagraphs(254)
          .split('\n')
          .map((p, i) => <Paragraph key={i}>{p}<br /><br /></Paragraph>)
      }</div>

      <div className='lblb-default-apps-footer'>
        <ShareArticle short iconsOnly />
        <ArticleMeta publishedOn='02/09/2019 17:13' updatedOn='03/09/2019 10:36' authors={[
          { name: 'Jean-Sol Partre', role: '', link: 'www.liberation.fr' },
          { name: 'Jean-Sol Partre', role: '', link: 'www.liberation.fr' },
          { name: 'Maxime Fabas', role: 'Production', link: 'lol.com' }
        ]} />
        <LibeLaboLogo target='blank' />
      </div>
    </div>
  }
}
