import React, { useState } from 'react';
import { Form, Input, Button, Upload, message, Card, Row, Col, Layout } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditDetails = () => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const { Content } = Layout;

    // Handle file upload
    const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleSubmit = (values) => {
        // Logic to handle the form submission
        console.log('Form values:', values);
        message.success('Profile updated successfully');
    };

    return (
        <Content style={{ margin: 20, background: "#fff", padding: 20, borderRadius: 8 }}>
            <Card title="Edit Profile" style={{ maxWidth: 800, margin: 'auto', marginTop: 20 }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        name: '',
                        email: '',
                        phone: '',
                        address: '',
                    }}
                >
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter your full name!' }]}
                            >
                                <Input placeholder="Enter your name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
                            >
                                <Input placeholder="Enter your email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true, message: 'Please enter your phone number!' }]}
                            >
                                <Input placeholder="Enter your phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: 'Please enter your address!' }]}
                            >
                                <Input.TextArea placeholder="Enter your address" rows={4} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                label="Upload Documents"
                                name="documents"
                                valuePropName="fileList"
                                getValueFromEvent={handleFileChange}
                                extra="Please upload supporting documents."
                            >
                                <Upload
                                    action="/upload" // Example upload URL
                                    listType="picture"
                                    fileList={fileList}
                                    beforeUpload={() => false}
                                    showUploadList={{ showRemoveIcon: true }}
                                >
                                    <Button icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Content>
    );
};

export default EditDetails;
