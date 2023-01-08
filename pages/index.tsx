import React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import axios from 'axios'

interface Tweets {
    edit_history_tweet_ids: string[],
    id: string,
    text: string
}
interface TwitterResponse {
    tweets: Tweets[]
}
// Logic
// Start Time: 10:20am
// Finish Time: 11:00am
//
// UI p.1
// Start Time: 11:00am
// Finish Time: 11:15am
//
// UI p.2
// Start Time: 12:06pm
// Finish Time: 12:25pm
const Home: NextPage = () => {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | undefined>()
    const [tweets, setTweets] = React.useState<Tweets[]>([])

    const setLatestTweets = async () => {
        setLoading(true)
        try {
            const latestTweets = await getLatestTweets()
            // Make sure to override the array
            setTweets([...latestTweets])
        } catch (err: any) {
            if (err.message) {
                setError(err.message)
            } else {
                setError("Oops Something went wrong. Try again later.")
            }
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 300)
        }
    }

    const getLatestTweets = React.useCallback(async () => {
        if (loading) return tweets
        const response = await axios.get<TwitterResponse>('/api/twitter')
        return response.data.tweets
    }, [loading, tweets])

    React.useEffect(() => {
        setLatestTweets()
    }, [])

    const goto = async (tweetId: string) => {
        const link = `https://twitter.com/anyuser/status/${tweetId}`
        window.open(link, '_blank')
    }

    const renderError = React.useMemo(() => {
        return <div className="alert alert-error shadow-lg">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
            </div>
        </div>

    }, [error])
    const renderLoading = React.useMemo(() => {
        return (
            <div className='h-[800px]'>
                <span className="text-lg text-bold">Loading...</span>
            </div>)
    }, [])
    const renderTweets = React.useMemo(() => {
        return tweets.map(tweet => <div className="card w-96 bg-base-100 shadow-xl" key={tweet.id}>
            <div className="card-body">
                {/*
                <h2 className="card-title">Tweet Id {tweet.id}</h2>
            */}
                <h3>Tweet Preview</h3>

                <p>{tweet.text}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm" onClick={() => goto(tweet.id)}>View Full Tweet</button>
                </div>
            </div>
        </div>)
    }, [tweets])

    return (
        <div>
            <Head>
                <title>Twitter Top 20</title>
                <meta name="description" content="Gets the latest 20 tweets baby!!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className='container mx-auto flex flex-col items-center justify-center p-4 min-h-screen'>
                <h2 className='text-xl font-bold'>Latest 20 Tweets</h2>
                {error && renderError}
                {loading ? renderLoading : (
                    <div className="gap-2 h-[800px] overflow-y-scroll flex flex-col items-center overflow-y-scroll">
                        {renderTweets}</div>
                )}
            </main>
        </div>
    )
}

export default Home
