export function generateSlug(text: string): string {
  if (!text) return '';
  return (
    text
      .toLowerCase() // Приводим к нижнему регистру
      .trim() // Удаляем пробелы в начале и в конце
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      // eslint-disable-next-line no-useless-escape
      .replace(/[^\w\-]+/g, '') // Удаляем все символы, кроме букв, цифр и дефисов
      // eslint-disable-next-line no-useless-escape
      .replace(/\-\-+/g, '-') // Заменяем несколько дефисов на один
      .replace(/^-+/, '') // Удаляем дефисы в начале
      .replace(/-+$/, '')
  ); // Удаляем дефисы в конце
}
