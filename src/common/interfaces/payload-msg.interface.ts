export interface IPayloadErrorFields {
  field: string;
  value: string;
  message: string[];
}

export interface IPayloadErrorSystems {
  domain: string;
  value: string;
  message: string;
}

/**
 * @interface
 * @since 1.0.0
 */
export interface IPayloadMSG {
  nonce: number;
  status: number;
  message: string;
  error: {
    fields: {
      count: number;
      errors: IPayloadErrorFields[];
    };
    systems: {
      count: number;
      errors: IPayloadErrorSystems[];
    };
  };
  payload: {
    count: number;
    items: any[];
  };
}
