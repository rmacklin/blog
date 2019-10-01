export const applyCallbacks = async (name, plugins, input, applyReturn) => {
  for (const plugin of plugins) {
    if (typeof plugin[name] === 'function') {
      const ret = await plugin[name](input);
      if (applyReturn) {
        applyReturn(ret);
      }
    }
  }
};
