import { createListboxWebComponent } from "../listbox-element";
import { getListboxPartSpec } from "./part-spec";

const partSpec = getListboxPartSpec("Sub");

export const Sub = createListboxWebComponent(partSpec);
export type SubElement = InstanceType<typeof Sub>;
