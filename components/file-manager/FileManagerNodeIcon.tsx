import {
  mdiCodeJson,
  mdiFileOutline,
  mdiFolderOutline,
  mdiImageOutline,
  mdiLanguageHtml5,
  mdiLanguageJavascript,
  mdiLanguageTypescript,
  mdiMicrosoftExcel,
  mdiMicrosoftWord,
  mdiSvg,
} from "@mdi/js";
import Icon from "@mdi/react";
import type { IconProps as MdiIconProps } from "@mdi/react/dist/IconProps";

const fileManagerDefaultIconDictionary = {
  json: mdiCodeJson,
  js: mdiLanguageJavascript,
  ts: mdiLanguageTypescript,
  doc: mdiMicrosoftWord,
  html: mdiLanguageHtml5,
  svg: mdiSvg,
  webp: mdiImageOutline,
  xls: mdiMicrosoftExcel,
};

function getFileManagerIcon(ext?: string) {
  if (!ext) {
    return mdiFolderOutline;
  }

  // @ts-ignore
  let icon = fileManagerDefaultIconDictionary[ext];

  if (!icon) {
    icon = mdiFileOutline;
  }

  return icon;
}

export interface FileManagerNodeIcon extends Omit<MdiIconProps, "path"> {
  ext?: string;
}

export default function FileManagerNodeIcon(props: FileManagerNodeIcon) {
  const { ext, size } = props;

  return <Icon path={getFileManagerIcon(ext)} size={size} />;
}
