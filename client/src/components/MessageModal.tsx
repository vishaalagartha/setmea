import { Input, Modal, Form, Typography, Flex, Button, Divider } from 'antd'
import { useForm } from 'antd/es/form/Form'
import useMessage from 'antd/es/message/useMessage'
import { type IMessage } from '../types/message'
import { readMessage, sendMessage } from '../api/messages'

interface MessageModalProps {
  message: IMessage | null
  setMessage: React.Dispatch<React.SetStateAction<IMessage | null>>
}

const MessageModal: React.FC<MessageModalProps> = ({ message, setMessage }: MessageModalProps) => {
  if (message === null) return
  const [form] = useForm()
  const [messageApi, contextHolder] = useMessage()

  const handleSendMessage: () => void = async () => {
    try {
      await form.validateFields()
      const { content } = form.getFieldsValue() as { content: string }
      const res = await sendMessage(message.sender, content)
      if (res.status === 201) {
        await messageApi.open({ type: 'success', content: 'Successfully sent message!' })
        handleClose()
      } else {
        form.setFieldsValue({ content: '' })
        await messageApi.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose: () => void = async () => {
    try {
      const res = await readMessage(message._id)
      if (res.status !== 200) {
        await messageApi.open({ type: 'error', content: res.data.message })
      }
    } catch (error) {
      console.error(error)
    }
    form.setFieldsValue({ content: '' })
    setMessage(null)
  }

  if (message === null) return null
  return (
    <Modal
      open={message !== null}
      onCancel={() => {
        handleClose()
      }}
      title={null}
      footer={
        <Flex justify="center">
          <Button type="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Flex>
      }
    >
      {contextHolder}
      <Flex vertical={true} align="center">
        <Form form={form} className="w-3/4">
          <Typography.Title level={3}>{message.senderUsername} says:</Typography.Title>
          <Typography.Text>{message.content}</Typography.Text>
          <Divider />
          <Typography.Text>Respond to {message.senderUsername}:</Typography.Text>
          <Form.Item name="content">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Flex>
    </Modal>
  )
}

export default MessageModal
