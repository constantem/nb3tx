package tw.com.fstop.nb3tx.domain;

public class AccountOption {
    private String value;
    private String text;

    public AccountOption() {}

    public AccountOption(String value, String text) {
        this.value = value;
        this.text = text;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}