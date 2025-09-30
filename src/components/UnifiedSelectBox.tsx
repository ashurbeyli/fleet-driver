import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';

interface SelectOption {
  id: string;
  label: string;
  value: string;
}

interface UnifiedSelectBoxProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (option: SelectOption) => void;
  error?: string;
  helpText?: string;
  style?: any;
  disabled?: boolean;
}

const UnifiedSelectBox: React.FC<UnifiedSelectBoxProps> = ({
  label,
  placeholder = 'Select an option',
  options,
  selectedValue,
  onSelect,
  error,
  helpText,
  style,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const selectRef = useRef<View>(null);

  const selectedOption = options.find(option => option.id === selectedValue);
  const { height: screenHeight } = Dimensions.get('window');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (option: SelectOption) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchText('');
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  // Close dropdown when pressing escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen && Platform.OS === 'web') {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        selectedValue === item.id && styles.selectedOption,
      ]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.optionText,
          selectedValue === item.id && styles.selectedOptionText,
        ]}
      >
        {item.label}
      </Text>
      {selectedValue === item.id && (
        <Text style={styles.checkmark}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const renderModal = () => {
    if (isOpen) {
      return (
        <Modal
          visible={isOpen}
          transparent
          animationType={Platform.OS === 'web' ? 'fade' : 'slide'}
          onRequestClose={handleClose}
          presentationStyle="overFullScreen"
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={handleClose}
            />
            <View style={[
              styles.modalContent,
              Platform.OS === 'web' && styles.webModalContent
            ]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select City</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.id}
                renderItem={renderOption}
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          </View>
        </Modal>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, style]} ref={selectRef}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.selectContainer}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            error && styles.selectButtonError,
            disabled && styles.selectButtonDisabled,
          ]}
          onPress={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.selectButtonText,
              !selectedOption && styles.placeholderText,
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Text style={styles.arrow}>{isOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

      </View>

      {renderModal()}

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helpText && !error && <Text style={styles.helpText}>{helpText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectContainer: {
    position: 'relative',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    minHeight: 56,
    ...DESIGN.shadows.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: COLORS.primary,
          boxShadow: `0 0 0 3px ${COLORS.primary}20`,
        },
      },
    }),
  },
  selectButtonError: {
    borderColor: COLORS.error,
    ...Platform.select({
      web: {
        boxShadow: `0 0 0 3px ${COLORS.error}20`,
      },
    }),
  },
  selectButtonDisabled: {
    backgroundColor: COLORS.backgroundDark,
    borderColor: COLORS.borderLight,
    opacity: 0.7,
  },
  selectButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  placeholderText: {
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
  arrow: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  // Modal overlay
  modalOverlay: {
    flex: 1,
    justifyContent: Platform.OS === 'web' ? 'center' : 'flex-end',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Platform.OS === 'web' ? SPACING.xl : 0,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: Platform.OS === 'web' ? DESIGN.borderRadius.xl : DESIGN.borderRadius.xl,
    borderTopLeftRadius: Platform.OS === 'web' ? DESIGN.borderRadius.xl : DESIGN.borderRadius.xl,
    borderTopRightRadius: Platform.OS === 'web' ? DESIGN.borderRadius.xl : DESIGN.borderRadius.xl,
    width: Platform.OS === 'web' ? 400 : '100%',
    maxHeight: Platform.OS === 'web' ? 600 : '70%',
    ...DESIGN.shadows.lg,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  webModalContent: {
    width: 400,
    maxHeight: 600,
    borderRadius: DESIGN.borderRadius.xl,
    ...Platform.select({
      web: {
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: DESIGN.borderRadius.full,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...DESIGN.shadows.sm,
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  optionsList: {
    maxHeight: 240,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        backgroundColor: COLORS.surface,
        borderRadius: DESIGN.borderRadius.md,
        overflow: 'hidden',
      },
    }),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: COLORS.backgroundDark,
        },
        '&:last-child': {
          borderBottomWidth: 0,
        },
      },
    }),
  },
  selectedOption: {
    backgroundColor: COLORS.primary + '08',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.primary,
    flex: 1,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  checkmark: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.error,
    marginTop: SPACING.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  helpText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
    lineHeight: TYPOGRAPHY.sizes.sm * TYPOGRAPHY.lineHeights.relaxed,
    fontWeight: TYPOGRAPHY.weights.normal,
  },
});

export default UnifiedSelectBox;
