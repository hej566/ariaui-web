import { createListboxWebComponent } from "../listbox-element";
import { getListboxPartSpec } from "./part-spec";

const partSpec = getListboxPartSpec("SubTrigger");

export const SubTrigger = createListboxWebComponent(partSpec);
export type SubTriggerElement = InstanceType<typeof SubTrigger>;
