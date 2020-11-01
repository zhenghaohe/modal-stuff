import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Modal, Button } from 'antd'

//

import PostForm from '../components/PostForm'

import usePost from '../hooks/usePost'
import useSavePost from '../hooks/useSavePost'
import useDeletePost from '../hooks/useDeletePost'

export const getServerSideProps = ({ params }) => {
  return {
    props: {
      postId: params.postId,
    },
  }
}

export default function Post({ postId }) {
  const router = useRouter()
  const postQuery = usePost(postId)
  const [savePost, savePostInfo] = useSavePost()
  const [deletePost] = useDeletePost()

  const onDelete = async () => {
    deletePost(postId)
    router.push('/')
  }
  // console.log('Button', Button)
  return (
    <>
      {postQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <div>
          <h3>
            <Link href="/[postId]" as={`/${postQuery.data.id}`}>
              <a>{postQuery.data.title}</a>
            </Link>
          </h3>
          <p>
            <small>Post ID: {postQuery.data.id}</small>
          </p>
          <PostForm
            initialValues={postQuery.data}
            onSubmit={savePost}
            submitText={
              savePostInfo.isLoading
                ? 'Saving...'
                : savePostInfo.isError
                ? 'Error!'
                : savePostInfo.isSuccess
                ? 'Saved!'
                : 'Save Post'
            }
          />
          <p>
            <Button type="dashed" danger onClick={onDelete}>
              Delete Post
            </Button>
          </p>
        </div>
      )}
    </>
  )
}
