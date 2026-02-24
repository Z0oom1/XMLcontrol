import { useState, useCallback } from 'react';

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface UseXMLValidatorReturn {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  validateXML: (content: string) => boolean;
  validateFile: (file: File) => Promise<boolean>;
  getErrorSummary: () => string;
}

export function useXMLValidator(): UseXMLValidatorReturn {
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [warnings, setWarnings] = useState<ValidationError[]>([]);

  const validateXML = useCallback((content: string): boolean => {
    const newErrors: ValidationError[] = [];
    const newWarnings: ValidationError[] = [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(content, 'application/xml');

      // Check for parse errors
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        const errorElement = xmlDoc.getElementsByTagName('parsererror')[0];
        const errorText = errorElement.textContent || 'Erro desconhecido';
        newErrors.push({
          line: 1,
          column: 1,
          message: errorText,
          severity: 'error',
        });
      }

      // Check for common XML issues
      if (!content.trim().startsWith('<?xml')) {
        newWarnings.push({
          line: 1,
          column: 1,
          message: 'Declaração XML não encontrada',
          severity: 'warning',
        });
      }

      // Check for unclosed tags
      const tagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)[^>]*>/g;
      const closingTagRegex = /<\/([a-zA-Z][a-zA-Z0-9-]*)>/g;
      const openTags = new Map<string, number>();
      let match;

      while ((match = tagRegex.exec(content)) !== null) {
        const tagName = match[1];
        if (!content.substring(match.index).match(new RegExp(`</${tagName}>`))) {
          newErrors.push({
            line: content.substring(0, match.index).split('\n').length,
            column: match.index,
            message: `Tag não fechada: <${tagName}>`,
            severity: 'error',
          });
        }
      }

      const isValid = newErrors.length === 0;
      setIsValid(isValid);
      setErrors(newErrors);
      setWarnings(newWarnings);

      return isValid;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Erro ao validar XML';
      newErrors.push({
        line: 1,
        column: 1,
        message: errorMsg,
        severity: 'error',
      });
      setIsValid(false);
      setErrors(newErrors);
      return false;
    }
  }, []);

  const validateFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      const content = await file.text();
      return validateXML(content);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Erro ao ler arquivo';
      setErrors([{
        line: 1,
        column: 1,
        message: errorMsg,
        severity: 'error',
      }]);
      setIsValid(false);
      return false;
    }
  }, [validateXML]);

  const getErrorSummary = useCallback((): string => {
    if (errors.length === 0 && warnings.length === 0) {
      return 'XML válido';
    }
    return `${errors.length} erro(s), ${warnings.length} aviso(s)`;
  }, [errors, warnings]);

  return {
    isValid,
    errors,
    warnings,
    validateXML,
    validateFile,
    getErrorSummary,
  };
}
