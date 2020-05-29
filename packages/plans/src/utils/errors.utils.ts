export type SerializableError = {
  code?: string;
  data?: any;
  message: string;
};

export const getSerializableError = (error: Error): SerializableError => {
  const { message } = error;
  const code =
    typeof (error as any).code === 'string' ? (error as any).code : undefined;
  const data =
    typeof (error as any).data !== 'undefined'
      ? (error as any).data
      : undefined;
  return { message, code, data };
};
