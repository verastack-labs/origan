// Lesson 0: setting up, and how to read these pages.
// The page text for this file is src/content/learn/java-collections/setup.mdx.

public class Lesson0Setup {
    // region: sum
    static int sum(int[] nums) {
        int total = 0;
        for (int n : nums) {
            total += n;
        }
        return total;
    }
    // endregion

    static void sumDemo() {
        // region: sum-demo
        int[] scores = {4, 8, 15, 16, 23, 42};
        System.out.println("total = " + sum(scores));
        // endregion
    }

    static void jshellDemo() {
        // region: array-loop
        int[] marks = {72, 85, 91};
        for (int mark : marks) {
            System.out.println(mark + " out of 100");
        }
        // endregion
    }

    /** Practice problems, as the reader first sees them. */
    static class Starters {
        // region: count-evens-start
        static int countEvens(int[] nums) {
            throw new UnsupportedOperationException("count the numbers that divide by 2 with no remainder");
        }
        // endregion

        // region: largest-start
        static int largest(int[] nums) {
            throw new UnsupportedOperationException("the biggest number; an empty array has none");
        }
        // endregion

        // region: running-total-start
        static int[] runningTotal(int[] nums) {
            throw new UnsupportedOperationException("each slot holds the sum so far");
        }
        // endregion
    }

    /** Worked solutions, with tests. */
    static class Solutions {
        // region: count-evens
        static int countEvens(int[] nums) {
            int count = 0;
            for (int n : nums) {
                if (n % 2 == 0) { // % is the remainder; zero left over means even
                    count++;
                }
            }
            return count;
        }
        // endregion

        // region: largest
        static int largest(int[] nums) {
            if (nums.length == 0) {
                // There is no honest number to return, so refuse loudly
                // instead of handing back a made-up one such as 0.
                throw new IllegalArgumentException("an empty array has no largest number");
            }
            int best = nums[0]; // start from a real item, so negatives work too
            for (int n : nums) {
                if (n > best) {
                    best = n;
                }
            }
            return best;
        }
        // endregion

        // region: running-total
        static int[] runningTotal(int[] nums) {
            int[] totals = new int[nums.length];
            int total = 0;
            for (int i = 0; i < nums.length; i++) {
                total += nums[i];
                totals[i] = total;
            }
            return totals;
        }
        // endregion
    }
}
