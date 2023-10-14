import { useParams } from "next/navigation"

interface YouTubeVideoProps {
    videoId: string;
}

function YouTubeVideo(props: YouTubeVideoProps) {
    return <iframe width="560" height="315" src={`https://www.youtube.com/embed/${props.videoId}`} frameBorder="0" allowFullScreen></iframe>
}

export default function Video() {
    // const router = useRouter();
    // const { id } = router.query;
    const params = useParams();
    if (!params) {
        return <div>Loading...</div>
    }
    if (Array.isArray(params.id)) {
        return <div>WTF</div>
    }

    const { id } = params;

    return (
        <main>
            <YouTubeVideo videoId={id} />
        </main>
    )
}