import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AutoIncrement,
  AUTOINCREMENT_MODEL_NAME,
} from '../../models/autoincrement';

/**
 * Service in charge of providing the auto-increase strategy
 */
@Injectable()
export class AutoIncrementService {
  /**
   * Constructor to which the corresponding dependencies are injected by the different modules for the correct functioning of the service
   * @param autoIncModel Mongoose auto-increment model injected to query documents
   */
  constructor(
    @InjectModel(AUTOINCREMENT_MODEL_NAME)
    private readonly autoIncModel: Model<AutoIncrement>,
  ) {}

  /**
   * Id increment value
   */
  private static readonly AUTO_INCREMENT_VALUE = 1;

  /**
   * Generates the following sequence of the model sent by parameter
   * @param modelN Model name
   * @param incValue Increment value default {@linkcode AutoIncrementService.AUTO_INCREMENT_VALUE}
   * @returns Next model sequence
   */
  public async getSequence(
    modelN: string,
    incValue: number = AutoIncrementService.AUTO_INCREMENT_VALUE,
  ): Promise<number> {
    const data: AutoIncrement = await this.autoIncModel.findOneAndUpdate(
      { modelN },
      { $inc: { seq: incValue } },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
    return data.seq;
  }
}
