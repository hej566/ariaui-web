import { createListboxWebComponent } from "../listbox-element";
import { getListboxPartSpec } from "./part-spec";

const partSpec = getListboxPartSpec("SubContent");

export const SubContent = createListboxWebComponent(partSpec);
export type SubContentElement = InstanceType<typeof SubContent>;
