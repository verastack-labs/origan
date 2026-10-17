import java.io.File;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * A tiny test runner, so the Java snippets can be tested with nothing but a
 * JDK. It finds every compiled class whose name ends in "Test", runs each
 * static no-argument method whose name starts with "test", and exits with a
 * non-zero status if any of them fails.
 *
 * Usage: java -ea -cp out TestRunner out
 */
public class TestRunner {
    public static void main(String[] args) throws Exception {
        boolean assertionsOn = false;
        assert assertionsOn = true; // this line only runs when -ea is given
        if (!assertionsOn) {
            System.err.println("Run with java -ea, or the assert lines in the lessons are skipped.");
            System.exit(2);
        }

        File root = new File(args[0]);
        List<String> classNames = new ArrayList<>();
        collect(root, "", classNames);
        classNames.sort(String::compareTo);

        int passed = 0;
        int failed = 0;
        for (String className : classNames) {
            Class<?> type = Class.forName(className);
            Method[] methods = type.getDeclaredMethods();
            Arrays.sort(methods, (a, b) -> a.getName().compareTo(b.getName()));
            for (Method method : methods) {
                boolean isTest = method.getName().startsWith("test")
                        && Modifier.isStatic(method.getModifiers())
                        && method.getParameterCount() == 0;
                if (!isTest) {
                    continue;
                }
                method.setAccessible(true);
                try {
                    method.invoke(null);
                    passed++;
                    System.out.println("ok     " + className + "." + method.getName());
                } catch (InvocationTargetException e) {
                    failed++;
                    System.out.println("FAILED " + className + "." + method.getName() + ": " + e.getCause());
                }
            }
        }

        System.out.println();
        System.out.println(passed + " passed, " + failed + " failed");
        if (failed > 0 || passed == 0) {
            System.exit(1);
        }
    }

    private static void collect(File dir, String prefix, List<String> found) {
        File[] files = dir.listFiles();
        if (files == null) {
            return;
        }
        for (File file : files) {
            String name = file.getName();
            if (file.isDirectory()) {
                collect(file, prefix + name + ".", found);
            } else if (name.endsWith("Test.class") && !name.contains("$")) {
                found.add(prefix + name.substring(0, name.length() - ".class".length()));
            }
        }
    }
}
