// Lesson 0: a program that checks itself. It is the way this course tests code
// when there is no test library: plain `assert` lines, switched on with -ea.

// region: first-check
public class FirstCheck {
    static int add(int a, int b) {
        return a + b;
    }

    static int sum(int[] nums) {
        int total = 0;
        for (int n : nums) {
            total += n;
        }
        return total;
    }

    public static void main(String[] args) {
        // Java skips assert lines unless you run with -ea, so a check can
        // never slow down or break a program you did not ask to test.
        assert add(2, 3) == 5 : "add(2, 3) should be 5";
        assert sum(new int[] {}) == 0 : "the sum of nothing should be 0";
        System.out.println("All checks ran");
    }
}
// endregion
