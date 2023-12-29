import { CalendarIcon } from "@/lib/icons";
import { Icon, InputGroup, InputRightElement } from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

interface DateInputProps {
    fieldName?: string,
    placeholder?: string,
    currentDate: Date | undefined,
    onChange: (newDate: Date) => void
}

const DateInput = ({ fieldName = 'date_input', placeholder = 'Choose',currentDate, onChange }: DateInputProps) => {
    const minDate = new Date(new Date().setDate(new Date().getDate() - 1))
    const onDateChange = (date: Date) => {
        onChange(date);
    }
    return (
        <InputGroup zIndex={9}>
            <SingleDatepicker 
                name = {fieldName}
                date={currentDate}
                onDateChange={onDateChange}
                minDate={minDate}
                configs={{ dateFormat: 'dd/MM/yyyy' }}
                usePortal
                propsConfigs={{
                    inputProps: {
                        placeholder: placeholder
                    },
                    popoverCompProps: {
                        popoverContentProps: {
                            borderRadius: '10px',
                            boxShadow: 'md',
                            padding: '0px'
                        },
                        popoverBodyProps: {
                            padding: '0px',
                            borderRadius: '10px'
                        }
                    },
                    calendarPanelProps: {
                        dividerProps: {
                            borderColor: 'brand.borderColor',
                            w: 'calc(100% + 22px)',
                        },
                        contentProps: {
                            border: '0px',
                            borderRadius: '10px',
                        }
                    },
                    dayOfMonthBtnProps: {
                        selectedBtnProps: {
                            bg: 'brand.primary',
                            color: 'white'
                        },
                        defaultBtnProps: {
                            _hover: { bg: 'brand.secondary', color: 'white' },
                            _disabled: { color: 'blackAlpha.500', cursor: 'not-allowed', hover: {} },
                        }
                    }
                }}
            />
            <InputRightElement h = '100%' pr = '8px'>
                <Icon as = {CalendarIcon} h = 'auto' w = 'auto' />
            </InputRightElement>
        </InputGroup>
    );
}

export default DateInput;