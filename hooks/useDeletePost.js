import axios from 'axios'
import { useMutation, queryCache } from 'react-query'
const DELETE = 'delete'
export default function useDeletePost() {
  return useMutation(
    async (postIds) => {
      for (const postId of postIds) {
        await axios.delete(`/api/posts/${postId}`).then((res) => res.data)
      }
    },
    {
      onSuccess: (data, variables) => {
        queryCache.invalidateQueries('posts')
      },
    }
  )
}

export const useDeletePostActions = () => ({})
