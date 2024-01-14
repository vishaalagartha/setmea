import { Input, Modal, Form, Typography, Flex, Button, Divider, App } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { type IMessage } from '../types/message'
import { readMessage, sendMessage } from '../api/messages'

interface MessageModalProps {
  message: IMessage | null
  setMessage: React.Dispatch<React.SetStateAction<IMessage | null>>
}

const MessageModal: React.FC<MessageModalProps> = ({ message, setMessage }: MessageModalProps) => {
  if (message === null) return
  const [form] = useForm()
  const { message: messageApi } = App.useApp()

  const handleSendMessage: () => void = async () => {
    try {
      await form.validateFields()
      const { content } = form.getFieldsValue() as { content: string }
      const res = await sendMessage(message.sender, content)
      if (res.status === 201) {
        await messageApi.success('Successfully sent message!')
        handleClose()
      } else {
        form.setFieldsValue({ content: '' })
        await messageApi.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await messageApi.error(JSON.stringify(error))
    }
  }

  const handleClose: () => void = async () => {
    try {
      const res = await readMessage(message._id)
      if (res.status !== 200) {
        await messageApi.error(JSON.stringify(res.data.message))
      }
    } catch (error) {
      console.error(error)
      await messageApi.error(JSON.stringify(error))
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
      }>
      <Flex vertical={true} align="center">
        <Form form={form} className="w-3/4">
          <Typography.Title level={3}>{message.senderUsername} says:</Typography.Title>
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
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
