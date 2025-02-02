import { notification } from "antd";

type NotificationType = "success" | "info" | "warning" | "error";

const openNotification = (type: NotificationType, message: string) => {
  notification[type]({
    message: message,
    placement: "top", // Xabar joylashuvi
    duration: 2, // Xabar davomiyligi (soniyalarda)
  });
};

export { openNotification };
