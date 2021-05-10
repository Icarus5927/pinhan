import { MessageBox, Message } from "element-ui";

/**
 * 封装 element-ui 弹框
 * @param msg 信息
 * @param type 类型
 * @param title 标题
 * @returns {Promise<MessageBoxData>}
 * @constructor
 */
export function handleConfirm(msg = "确定执行此操作吗？", type = "warning", title = "提示") {
  return MessageBox.confirm(msg, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: type
  });
}

/**
 * @author 封装 element-ui 消息提示
 * @param text
 * @param type
 * @returns {Promise}
 */
export function handleAlert(text = "操作成功", type = "success") {
  return Message({
    showClose: true,
    message: text,
    type: type
  });
}
