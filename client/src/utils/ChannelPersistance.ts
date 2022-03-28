import { read, write, remove } from "store/storages/localStorage";

export const saveChannel = (channel: string) =>
  write("communethChannel", channel);
export const getSavedChannel = () => read("communethChannel");
export const removeSavedChannel = () => remove("communethChannel");
