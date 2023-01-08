// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

axios.defaults.headers.common['authorization'] = `Bearer ${process.env.TWITTER_BEARER_TOKEN}`

type Data = {
    tweets: Tweet[],
    message?: any

}
interface Tweet {
        edit_history_tweet_ids: string[],
        id: string,
        text: string
}

interface TwitterResponse {
    data: Tweet[],
    meta: {
        newest_id: string,
        oldest_id: string,
        result_count: 20,
        next_token: string
    }
}

const getLatestTweets = async (count: number, hashTags: string[]) => {
    const baseURL = new URL('https://api.twitter.com/2/tweets/search/recent');
    // Append the hashtags
    const hTags = hashTags.map(tag => encodeURI(tag))
    // Must seperate with a space to get results with both
    baseURL.searchParams.append("query", hTags.join(' '))
    baseURL.searchParams.append("max_results", count.toString())
    try {
        const response = await axios.get<TwitterResponse>(baseURL.toString())
        return response.data
    } catch (err: any) {
        if (err.response) {
            console.log(err.response.data)
            if (err.response.data.errors[0].message) {
                throw new Error(`Could not complete request: ${err.response.data.errors[0].message}`)
            } else {
                throw new Error(`Could not complete request: UnkownError`)
            }
        }
        throw err
    }


}
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    try {
        const twitterResponse = await getLatestTweets(20, ["#react", "#cloud"])
        res.status(200).json({tweets: twitterResponse.data})
    } catch (err: any) {
        res.status(400).json({ tweets: [],message: err.message })
    }
}
