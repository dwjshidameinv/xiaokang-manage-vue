export default function formatDateTime(isoString: any) {
    // 使用Date对象解析ISO字符串
    const date = new Date(isoString);
  
    // 检查日期对象是否有效
    if (isNaN(date.getTime())) {
      throw new Error("Invalid ISO 8601 date time string");
    }
  
    // 使用字符串模板和字符串切片来格式化日期和时间
    const formattedString = `${date.getFullYear()}-${(
      "0" +
      (date.getMonth() + 1)
    ).slice(-2)}-${("0" + date.getDate()).slice(-2)} ${(
      "0" + date.getHours()
    ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
      "0" + date.getSeconds()
    ).slice(-2)}`;
  
    return formattedString;
  }