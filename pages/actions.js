import axios from 'axios'
import { useMutation, queryCache } from 'react-query'
import { notification } from 'antd'
import { genereateModal } from '../actionHelperLib'
function useDeletePost(config) {
  return useMutation(async (postIds) => {
    for (const postId of postIds) {
      await axios.delete(`/api/posts/${postId}`).then((res) => res.data)
    }
  }, config)
}

export const DELETE = 'delete'
export const DEPRECATE = 'deprecate'

const usePostActions = () => ({
  [DELETE]: {
    frictionModal: genereateModal((props) => ({
      header: 'Delete posts',
      content: `You are about to delete ${props.items.length} post(s)`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    })),
    mutation: useDeletePost({
      onSuccess: (_, items) => {
        notification.success({
          message: `successfully delete ${items.length} post(s)`,
          description: 'You did it!',
        })
      },
      onError: (error) => {
        notification.error({
          message: `something went wrong`,
          description: `error: ${error.message}`,
        })
      },
      onSettled: () => queryCache.invalidateQueries('posts'),
    }),
  },
  [DEPRECATE]: {
    // this is doing the same thing as DELETE. I added it here to just demostrate that this supports multiple
    // different kinds of actions
    frictionModal: genereateModal((props) => ({
      header: 'Deprecate posts',
      content: `You are about to deprecate ${props.items.length} posts`,
      confirmText: 'Deprecate',
      cancelText: 'Cancel',
    })),
    mutation: useDeletePost({
      onSuccess: (_, items) => {
        notification.success({
          message: `successfully Deprecate ${items.length} post(s)`,
          description: 'You made it!',
        })
      },
      onError: (error) => {
        notification.error({
          message: `something went wrong`,
          description: `error: ${error.message}`,
        })
      },
      onSettled: () => queryCache.invalidateQueries('posts'),
    }),
  },
})

export default usePostActions
