import dayjs from "dayjs";
import { MemberCurrency } from "../constants/member";

export const displayCurrency = (currency) => {
    switch (currency) {
        case MemberCurrency.PLN:
            return "zł";
        case MemberCurrency.EUR:
            return "€";
        case MemberCurrency.USD:
            return "$";
        case MemberCurrency.BYN:
            return "Br";
        default:
            return "";
    }
};

export const getBackgroundColor = (index, row, previousRow) => {
    if (index === 0 || (index !== 0 && !dayjs(row?.createdAt).isSame(previousRow?.createdAt, 'month'))) {
      return true;
    }
    return false;
};

export const isDifferentMonth = (currentRow, nextRow) => {
    return !nextRow || !dayjs(currentRow?.createdAt).isSame(nextRow?.createdAt, 'month');
};
