import React, { useEffect } from 'react';
import { Form, Button } from 'antd';
import ImageUpload from '@/components/Form/ImageUpload';
import { imageUploadValidator } from '@/utils/validators';
import { getBase64 } from '@/components/Form/ImageUpload/utils';
const Switch: React.FC = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      file: '',
    });
  }, []);
  return (
    <Form form={form} onFinish={console.log}>
      <Form.Item
        name="file"
        getValueFromEvent={(e) => {
          console.log(e);
          return e;
        }}
        rules={[imageUploadValidator()]}
      >
        <ImageUpload />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">提交</Button>
      </Form.Item>
    </Form>
  );
};

export default Switch;
