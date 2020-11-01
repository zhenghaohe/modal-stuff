import React, { useState } from 'react'
import { Modal, Button } from 'antd'

// Imagine this is from some other package.
export function useItemAction({ items, itemActions }) {
  const [frictionActionVisible, setFrictionActionVisible] = useState(undefined)
  const isActionLoading = (actionId) => {
    const mutation =
      itemActions && itemActions[actionId] && itemActions[actionId].mutation[1]
    return mutation && mutation.isLoading
  }
  const triggerAction = (actionId) => {
    if (!itemActions || !itemActions[actionId]) {
      return
    }
    const action = itemActions[actionId]
    const [mutate] = action.mutation
    if (items.length) {
      // Allow users to see a friction modal
      if (action.frictionModal) {
        setFrictionActionVisible({
          id: actionId,
        })
      } else {
        return mutate(items)
      }
    }
  }

  const renderFrictionModal = () => {
    if (
      !itemActions ||
      !frictionActionVisible ||
      !itemActions[frictionActionVisible.id]
    ) {
      return
    }

    const actionId = frictionActionVisible.id

    const generateFrictionModal = itemActions[actionId].frictionModal

    return generateFrictionModal({
      closeModal: () => setFrictionActionVisible(undefined),
      mutation: itemActions[actionId].mutation,
      items,
    })
  }

  return {
    renderFrictionModal,
    triggerAction,
    isActionLoading,
  }
}

export const genereateModal = (renderFields) => (props) => (
  <ModerateRiskModal {...props} renderFields={renderFields} />
)

function ModerateRiskModal(props) {
  // this is written by the library author, the point is to make the experience of making modal for bulk actions easier
  // but I feel like this pattern is not flexible for the users
  // e.g. they do not have any control over when to close the modal
  const { items, closeModal, mutation, renderFields } = props
  const { header, cancelText, confirmText, content } = renderFields(props)
  const [mutate, { isLoading }] = mutation

  const onSettled = () => {
    closeModal()
  }

  const handleSubmit = () => {
    mutate(items, { onSettled })
  }

  return (
    <Modal
      onDismiss={closeModal}
      title={header}
      visible={true}
      footer={[
        <Button type="primary" loading={isLoading} onClick={handleSubmit}>
          {confirmText}
        </Button>,
        <Button onClick={closeModal}>{cancelText}</Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  )
}
