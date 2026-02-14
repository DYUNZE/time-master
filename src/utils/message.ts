import { ElMessage,type MessageOptions } from "element-plus";

const message = (options: string | MessageOptions,type:MessageOptions['type'])=>{
    const finalOptions = typeof options === 'string'?{message:options,type,plain:true}:{...options,plain:true}
    return ElMessage(finalOptions)
}

export default {
    success: (options: string | MessageOptions) => message(options, 'success'),
    error: (options: string | MessageOptions) => message(options, 'error'),
    warning: (options: string | MessageOptions) => message(options, 'warning'),
    info: (options: string | MessageOptions) => message(options, 'info'),
    closeAll: ElMessage.closeAll
  }