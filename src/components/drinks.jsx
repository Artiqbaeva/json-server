import { useEffect, useState } from "react";
import { api } from "../api/api";
import {
  Button,
  Card,
  Modal,
  Form,
  Input,
  Popconfirm,
  Rate,
  Empty,
  message,
} from "antd";
import { Image } from "antd";

const { Meta } = Card;

const Drinks = () => {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);

  const fetchData = () => {
    api.get("/drinks").then((res) => {
      setData(res.data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditItem(null);
  };

  const onFinish = (values) => {
    setCreateLoading(true);
    if (editItem) {
      // Update drink
      api
        .put(`/drinks/${editItem.id}`, values)
        .then(() => {
          message.success("Drink updated successfully");
          fetchData();
          handleCancel();
        })
        .catch(() => message.error("Failed to update drink"))
        .finally(() => setCreateLoading(false));
    } else {
      // Create new drink
      api
        .post("/drinks", values)
        .then(() => {
          message.success("Drink added successfully");
          fetchData();
          handleCancel();
        })
        .catch(() => message.error("Failed to add drink"))
        .finally(() => setCreateLoading(false));
    }
  };

  const handleDelete = (id) => {
    api.delete(`/drinks/${id}`).then(() => {
      message.success("Drink deleted");
      fetchData();
    });
  };

  const handleEdit = (item) => {
    setEditItem(item);
    showModal();
  };

  return (
    <>
    <div className="container mx-auto ">
      <div className="flex justify-between items-center my-4">
          <h2 className="text-2xl font-semibold">Drinks Management</h2>
             <Button onClick={showModal} type="primary">
               Add New Drink
             </Button>
           </div>

      {!data?.length && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

      <div className="grid grid-cols-5 gap-6 mt-18">
        {data?.map((item) => (
          <Card
            hoverable
            key={item.id}
            
            cover={
              <Image
                style={{ height: 180 }}
                className="h-[180px] object-contain w-full"
                src={item.image}
                alt={item.title}
              />
            }
          >
            <Meta title={item.title} description={item.company_name} />
            <div className="mt-2 text-sm text-gray-600">
              Price: {item.price} UZS
            </div>
            <div className="text-sm text-gray-600">Volume: {item.volume}</div>
            <div className="text-sm text-gray-600">Type: {item.type}</div>
            <div className="mt-4">
              <Rate allowHalf defaultValue={0} />
            </div>
            <div className="mt-4 flex gap-2">
              <Popconfirm
                title="Delete this drink?"
                onConfirm={() => handleDelete(item.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger>Delete</Button>
              </Popconfirm>
              <Button onClick={() => handleEdit(item)}>Edit</Button>
            </div>
          </Card>
        ))}
      </div>

      {isModalOpen && (
        <Modal
          title={editItem ? "Update Drink" : "Add New Drink"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
        >
        <Form
  name="drinkForm"
  initialValues={editItem}
  onFinish={onFinish}
  autoComplete="off"
  layout="vertical"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Form.Item
      label="Drink Name"
      name="title"
      rules={[{ required: true, message: "Please enter the drink name" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Company Name"
      name="company_name"
      rules={[{ required: true, message: "Please enter the company name" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Price"
      name="price"
      rules={[{ required: true, message: "Please enter the price" }]}
    >
      <Input type="number" />
    </Form.Item>

    <Form.Item
      label="Volume (e.g. 0.5L)"
      name="volume"
      rules={[{ required: true, message: "Please enter the volume" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Type (e.g. carbonated, still)"
      name="type"
      rules={[{ required: true, message: "Please enter the type" }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Image URL"
      name="image"
      rules={[{ required: true, message: "Please enter the image URL" }]}
    >
      <Input />
    </Form.Item>
  </div>

  <Form.Item className="mt-4">
    <Button
      loading={createLoading}
      className="w-full rounded-xl"
      type="primary"
      htmlType="submit"
    >
      {editItem ? "Update" : "Create"}
    </Button>
  </Form.Item>
</Form>
        </Modal>
      )}
    
    </div>
    <footer className="w-full bg-gray-100 mt-20 py-8 border-t border-gray-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        {/* Left Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800"> Drinks Hub</h3>
          <p className="text-gray-500 text-sm mt-1">
            Your go-to place for managing refreshing beverages!
          </p>
        </div>

        {/* Center Section (optional) */}
        <div className="text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Drinks Hub. All rights reserved.</p>
        </div>

        {/* Right Section (Social or Links) */}
        <div className="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-pink-500 text-gray-600 transition"
          >
            Instagram
          </a>
          <a
            href="https://t.me"
            target="_blank"
            className="hover:text-blue-500 text-gray-600 transition"
          >
            Telegram
          </a>
          <a
            href="mailto:info@drinkshub.com"
            className="hover:text-green-500 text-gray-600 transition"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Drinks;
