import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Objects;

/** The few assertion helpers the tests need, so no test library is required. */
final class Check {
    private Check() {}

    static void eq(Object expected, Object actual) {
        if (!Objects.equals(expected, actual)) {
            throw new AssertionError("expected <" + expected + "> but got <" + actual + ">");
        }
    }

    static void eq(int[] expected, int[] actual) {
        eq(java.util.Arrays.toString(expected), java.util.Arrays.toString(actual));
    }

    static void isTrue(boolean condition, String message) {
        if (!condition) {
            throw new AssertionError(message);
        }
    }

    /** Runs the code and returns everything it printed, with \n line ends on every system. */
    static String printed(Runnable code) {
        PrintStream original = System.out;
        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        System.setOut(new PrintStream(bytes, true));
        try {
            code.run();
        } finally {
            System.setOut(original);
        }
        return bytes.toString().replace("\r\n", "\n");
    }

    /** Passes only if the code throws exactly the given kind of exception. */
    static void throwsA(Class<? extends Throwable> kind, Runnable code) {
        try {
            code.run();
        } catch (Throwable thrown) {
            if (thrown.getClass() == kind) {
                return;
            }
            throw new AssertionError("expected " + kind.getSimpleName() + " but got " + thrown);
        }
        throw new AssertionError("expected " + kind.getSimpleName() + " but nothing was thrown");
    }
}
