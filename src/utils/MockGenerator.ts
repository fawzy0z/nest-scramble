/** Nest-Scramble | Developed by Mohamed Mustafa | MIT License **/
import { faker } from '@faker-js/faker';
import { AnalyzedType, PropertyInfo } from './DtoAnalyzer';

export class MockGenerator {
  /**
   * Generates mock data based on the analyzed type
   * @param analyzedType The analyzed type information
   * @returns Mock data object
   */
  static generateMock(analyzedType: AnalyzedType): any {
    if (analyzedType.isArray) {
      // Generate array of mocks
      const count = faker.number.int({ min: 1, max: 5 });
      return Array.from({ length: count }, () => this.generateMock({ ...analyzedType, isArray: false }));
    }

    if (analyzedType.unionTypes) {
      // Pick a random union type
      const randomType = faker.helpers.arrayElement(analyzedType.unionTypes);
      return this.generateMockForType(randomType);
    }

    if (analyzedType.properties) {
      // Generate object with properties
      const obj: any = {};
      for (const prop of analyzedType.properties) {
        if (!prop.type.isOptional || faker.datatype.boolean()) {
          obj[prop.name] = this.generateMock(prop.type);
        }
      }
      return obj;
    }

    // Generate based on type string
    return this.generateMockForType(analyzedType.type);
  }

  private static generateMockForType(type: string): any {
    const lowerType = type.toLowerCase();

    if (lowerType.includes('string')) {
      return faker.lorem.words();
    }

    if (lowerType.includes('number') || lowerType.includes('int') || lowerType.includes('float')) {
      return faker.number.int({ min: 1, max: 100 });
    }

    if (lowerType.includes('boolean')) {
      return faker.datatype.boolean();
    }

    if (lowerType.includes('date')) {
      return faker.date.recent().toISOString();
    }

    // Smart mocking based on property name patterns
    if (lowerType === 'string') {
      // This would be called with property name context, but for now, generic
      return faker.lorem.word();
    }

    // Default fallback
    return faker.lorem.word();
  }

  /**
   * Generates mock data for a property, using the property name for smarter generation
   * @param property The property info
   * @returns Mock value
   */
  static generateMockForProperty(property: PropertyInfo): any {
    const name = property.name.toLowerCase();

    if (property.type.isArray) {
      const count = faker.number.int({ min: 1, max: 5 });
      return Array.from({ length: count }, () => this.generateMockForPropertyName(name, { ...property.type, isArray: false }));
    }

    if (property.type.properties) {
      const obj: any = {};
      for (const prop of property.type.properties) {
        if (!prop.type.isOptional || faker.datatype.boolean()) {
          obj[prop.name] = this.generateMockForProperty(prop);
        }
      }
      return obj;
    }

    return this.generateMockForPropertyName(name, property.type);
  }

  private static generateMockForPropertyName(name: string, type: AnalyzedType): any {
    const typeStr = type.type.toLowerCase();

    // Email
    if (name.includes('email')) {
      return faker.internet.email();
    }

    // Name
    if (name.includes('name') || name.includes('firstname') || name.includes('lastname')) {
      return faker.person.fullName();
    }

    // Phone
    if (name.includes('phone') || name.includes('mobile') || name.includes('tel')) {
      return faker.phone.number();
    }

    // Address
    if (name.includes('address') || name.includes('street')) {
      return faker.location.streetAddress();
    }

    // City
    if (name.includes('city')) {
      return faker.location.city();
    }

    // Country
    if (name.includes('country')) {
      return faker.location.country();
    }

    // URL
    if (name.includes('url') || name.includes('website')) {
      return faker.internet.url();
    }

    // ID
    if (name.includes('id') && typeStr.includes('number')) {
      return faker.number.int({ min: 1, max: 1000 });
    }

    // Age
    if (name.includes('age') && typeStr.includes('number')) {
      return faker.number.int({ min: 18, max: 80 });
    }

    // Date
    if (name.includes('date') || name.includes('created') || name.includes('updated')) {
      return faker.date.recent().toISOString();
    }

    // Description
    if (name.includes('description') || name.includes('bio')) {
      return faker.lorem.sentences();
    }

    // Title
    if (name.includes('title')) {
      return faker.lorem.words(3);
    }

    // Fallback to type-based generation
    return this.generateMockForType(type.type);
  }
}