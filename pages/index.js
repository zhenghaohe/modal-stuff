import React, { useState } from 'react'
import { useQuery, useMutation, queryCache } from 'react-query'
import { Table, Button } from 'antd'
import usePostActions, { ARCHIVE, DELETE } from './actions'
import axios from 'axios'
import { useItemAction } from '../actionHelperLib'
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
  const [createPost, createPostInfo] = useMutation(
    (values) => axios.post('/api/posts', values),
    {
      onSuccess: () => {
        queryCache.invalidateQueries('posts')
        setSelectedKeys([])
      },
    }
  )
  const items = postsQuery.data?.map((post) => ({
    key: post.id,
    desc: post.title,
  }))

  const {
    renderFrictionModal,
    triggerAction,
    isActionLoading,
  } = useItemAction({ items: selectedKeys, itemActions: usePostActions() })

  return (
    <section>
      {/* 👇 this is an anti pattern for hooks? */}
      {renderFrictionModal()}
      <div>
        <div>
          {postsQuery.isLoading ? (
            <span>Loading...</span>
          ) : (
            <>
              <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
              <div style={{ width: '75%', margin: '30px auto' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    marginBottom: '20px',
                  }}
                >
                  <Button
                    type="primary"
                    danger
                    onClick={() => triggerAction(DELETE)}
                    loading={isActionLoading(DELETE)}
                    disabled={selectedKeys.length === 0}
                  >
                    Delete
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => triggerAction(ARCHIVE)}
                    loading={isActionLoading(ARCHIVE)}
                    disabled={selectedKeys.length === 0}
                    style={{ marginRight: '10px' }}
                  >
                    Archive
                  </Button>
                </div>
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
