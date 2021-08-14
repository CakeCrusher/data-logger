export const GET_VIDEO_FILESNIPPET = `
query MyQuery($videoId: String!) {
  video_by_pk(videoId: $videoId) {
    fileSnippets {
      fps
      height
      width
      githubURL
      frameData {
        frame
        fileInFrames {
          fileURL
          height
          width
          x
          y
        }
      }
    }
  }
}
`;