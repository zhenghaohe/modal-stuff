import React, { useState } from 'react'
import { useQuery, useMutation, queryCache } from 'react-query'
import { Modal, Table, Button } from 'antd'
import useDeletePost from '../hooks/useDeletePost'

import axios from 'axios'

import PostForm from '../components/PostForm'

const columns = [
  {
    title: 'ID',
    dataIndex: 'key',
  },
  {
    title: 'Title',
    dataIndex: 'desc',
  },
]

export default function Posts() {
  const postsQuery = useQuery('posts', () =>
    axios.get('/api/posts').then((res) => res.data)
  )
  const [selectedKeys, setSelectedKeys] = useState([])
  console.log('selectedKeys', selectedKeys)
  const [isOpen, setIsOpen] = useState(false)
  const [createPost, createPostInfo] = useMutation(
    (values) => axios.post('/api/posts', values),
    {
      onSuccess: () => {
        queryCache.invalidateQueries('posts')
        setSelectedKeys([])
      },
    }
  )
  const [deletePost, deleteQuery] = useDeletePost()

  const items = postsQuery.data?.map((post) => ({
    key: post.id,
    desc: post.title,
  }))

  return (
    <section>
      <Modal
        title="Delete posts"
        visible={isOpen}
        footer={[
          <Button
            danger
            type="primary"
            loading={deleteQuery.isLoading}
            onClick={async () => {
              await deletePost(selectedKeys)
              setIsOpen(false)
            }}
          >
            Confirm
          </Button>,
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>,
        ]}
      >
        <p>You are about to delete {selectedKeys.length} posts</p>
      </Modal>
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <div style={{ width: '75%', margin: '30px auto' }}>
                <Button
                  type="primary"
                  danger
                  onClick={() => setIsOpen(true)}
                  disabled={selectedKeys.length === 0}
                >
                  Delete
                </Button>
                <Table
                  columns={columns}
                  dataSource={items}
                  rowSelection={{
                    onChange(keys) {
                      setSelectedKeys(keys)
                    },
                    selectedKeys,
                  }}
                />
              </div>
              <br />
            </>
          )}
        </div>
      </div>

      <hr />

      <div>
        <h3>Create New Post</h3>
        <div>
          <PostForm
            onSubmit={createPost}
            clearOnSubmit
            submitText={
              createPostInfo.isLoading
                ? 'Saving...'
                : createPostInfo.isError
                ? 'Error!'
                : createPostInfo.isSuccess
                ? 'Saved!'
                : 'Create Post'
            }
          />
        </div>
      </div>
    </section>
  )
}
