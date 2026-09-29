export default function VideoPlayer({ video }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
      <video
        className="h-full w-full"
        src={video.videoUrl}
        poster={video.poster}
        controls
        autoPlay
        preload="metadata"
      >
        Seu navegador não suporta a reprodução de vídeos.
      </video>
    </div>
  )
}
