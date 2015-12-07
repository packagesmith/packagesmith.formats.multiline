export default function multiLineFile(
  process,
  {
    newLine = '\n',
    unique = true,
    omitEmptyLines = true,
    insertFinalNewline = true,
  } = {}
) {
  return (contents, ...rest) => {
    contents = contents.split(/\r?\n/g);
    let newContents = process(contents, ...rest);
    if (unique) {
      newContents = newContents.filter((value, index, total) => total.indexOf(value) === index);
    }
    if (omitEmptyLines) {
      newContents = newContents.filter((line) => line);
    }
    if (insertFinalNewline) {
      newContents.push('');
    }
    return newContents.join(newLine);
  };
}
