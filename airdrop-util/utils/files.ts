import * as fs from "fs";
import * as path from "path";

/** Проверяет, является ли строка путем к файлу
 * @param filePath путь к файлу
 * @returns boolean
 */
export function isFilePath(filePath: string): boolean {
  try {
    const absolutePath = path.resolve(filePath);
    return fs.existsSync(absolutePath) && fs.lstatSync(absolutePath).isFile();
  } catch (err) {
    console.error(`Ошибка при проверке пути: ${err}`);
    return false;
  }
}

/** Чтение файла и преобразование JSON-строки в массив
 * @param filePath путь к файлу
 * @returns Promise<string[]>
 */
export function readFileAsArray(filePath: string): string[] {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const array: string[] = JSON.parse(data);
    return array;
  } catch (err) {
    throw new Error(`Ошибка при чтении или парсинге файла: ${err}`);
  }
}
