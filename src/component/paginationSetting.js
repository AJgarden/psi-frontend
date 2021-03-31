export const getPaginationSetting = (pager, onChange) => {
  return {
    ...pager,
    showTotal: (total, range) => `${range[0]} - ${range[1]} 共 ${total} 筆`,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange
  }
}
